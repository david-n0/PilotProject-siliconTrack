<?php
$privateKeyPath = __DIR__ . '/config/jwt/private.pem';
$publicKeyPath  = __DIR__ . '/config/jwt/public.pem';

$resource = openssl_pkey_new([
    'private_key_bits' => 4096,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
]);

if (!$resource) {
    echo 'ERROR: ' . openssl_error_string() . PHP_EOL;
    exit(1);
}

openssl_pkey_export($resource, $privateKey);
$details   = openssl_pkey_get_details($resource);
$publicKey = $details['key'];

file_put_contents($privateKeyPath, $privateKey);
file_put_contents($publicKeyPath,  $publicKey);

echo 'private.pem created' . PHP_EOL;
echo 'public.pem  created' . PHP_EOL;
