<?php

namespace App\User\Infrastructure;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

// Verifikuje Firebase ID token: proverava RSA potpis Google-ovim javnim kljucem,
// pa claims-e (aud = nas projekat, iss = Google, exp = nije istekao).
final class GoogleTokenVerifier
{
    private const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

    public function __construct(
        private readonly HttpClientInterface $http,
        private readonly CacheInterface      $cache,
        private readonly string              $firebaseProjectId,
    )
    {
    }

    public function verify(string $idToken): array
    {
        if (trim($idToken) === '') {
            throw new \InvalidArgumentException('Google ID token je obavezan.');
        }

        try {
            $payload = JWT::decode($idToken, $this->publicKeys());
        } catch (\Throwable $e) {
            throw new \InvalidArgumentException('Google token nije validan: ' . $e->getMessage());
        }

        if (($payload->aud ?? null) !== $this->firebaseProjectId) {
            throw new \InvalidArgumentException('Google token nije izdat za ovu aplikaciju.');
        }
        if (($payload->iss ?? null) !== 'https://securetoken.google.com/' . $this->firebaseProjectId) {
            throw new \InvalidArgumentException('Neocekivan izdavalac tokena.');
        }
        if (empty($payload->email)) {
            throw new \InvalidArgumentException('Google nalog nema email adresu.');
        }
        if (($payload->email_verified ?? false) !== true) {
            throw new \InvalidArgumentException('Email na Google nalogu nije verifikovan.');
        }

        return [
            'email' => strtolower($payload->email),
            'name' => $payload->name ?? explode('@', $payload->email)[0],
            'uid' => $payload->sub,
        ];
    }

    /** @return array<string, Key> kid => javni kljuc */
    private function publicKeys(): array
    {
        // Google rotira kljuceve otprilike dnevno - kesiramo ih na sat vremena.
        $certs = $this->cache->get('google_secure_token_certs', function (ItemInterface $item): array {
            $item->expiresAfter(3600);
            return $this->http->request('GET', self::CERTS_URL)->toArray();
        });

        $keys = [];
        foreach ($certs as $kid => $certPem) {
            $publicKey = openssl_pkey_get_public($certPem);
            if ($publicKey !== false) {
                $keys[$kid] = new Key($publicKey, 'RS256');
            }
        }

        return $keys;
    }
}
