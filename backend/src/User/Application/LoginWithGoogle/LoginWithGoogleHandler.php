<?php

namespace App\User\Application\LoginWithGoogle;

use App\User\Domain\User;
use App\User\Domain\UserRepositoryInterface;
use App\User\Domain\UserRole;
use App\User\Infrastructure\GoogleTokenVerifier;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class LoginWithGoogleHandler
{
    // Rangovi: nalogu nikad ne snizavamo rolu, samo je podizemo na podrazumevanu.
    private const RANK = [
        'ROLE_VIEWER' => 1,
        'ROLE_ENGINEER' => 2,
        'ROLE_ADMIN' => 3,
    ];

    public function __construct(
        private readonly GoogleTokenVerifier         $verifier,
        private readonly UserRepositoryInterface     $users,
        private readonly UserPasswordHasherInterface $hasher,
        // Podrazumevana rola za Google prijavu dolazi iz okruzenja (GOOGLE_DEFAULT_ROLE):
        // demo rezim = ROLE_ADMIN, zatvoreni rezim = ROLE_VIEWER.
        private readonly string                      $googleDefaultRole,
    )
    {
    }

    public function handle(string $idToken): User
    {
        $profile = $this->verifier->verify($idToken);
        $email = $profile['email'];
        $defaultRole = UserRole::from($this->googleDefaultRole);

        $user = $this->users->findByEmail($email);

        if ($user !== null) {
            if ($this->rankOf($user) < self::RANK[$defaultRole->value]) {
                $user->changeRole($defaultRole);
                $this->users->save($user);
            }
            return $user;
        }

        // Prva prijava — lozinka je nasumicna, na ovaj nalog se ulazi samo preko Google-a.
        $temp = User::create($profile['name'], $email, '', $defaultRole);
        $randomHash = $this->hasher->hashPassword($temp, bin2hex(random_bytes(32)));

        $user = User::create($profile['name'], $email, $randomHash, $defaultRole);
        $this->users->save($user);

        return $user;
    }

    private function rankOf(User $user): int
    {
        $max = 0;
        foreach ($user->getRoles() as $role) {
            $max = max($max, self::RANK[$role] ?? 0);
        }
        return $max;
    }
}
