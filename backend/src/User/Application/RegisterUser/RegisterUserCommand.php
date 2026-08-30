<?php

namespace App\User\Application\RegisterUser;

// Command je samo "data container" — nema logike, samo drzi podatke
// Handler ce uzeti ove podatke i obaviti posao
class RegisterUserCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $plainPassword,  // plain text koji će handler hesovati
    ) {}
}
