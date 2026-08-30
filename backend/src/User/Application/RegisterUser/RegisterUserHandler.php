<?php

namespace App\User\Application\RegisterUser;

use App\User\Domain\User;
use App\User\Domain\UserRepositoryInterface;
use App\User\Domain\UserRole;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterUserHandler
{
    public function __construct(
        private readonly UserRepositoryInterface     $userRepository,
        // Symfony ugradjeni servis koji hešuje lozinke pomocu bcrypt algoritma
        private readonly UserPasswordHasherInterface $passwordHasher,
    )
    {
    }

    public function handle(RegisterUserCommand $command): void
    {
        // 1. Proveri da li email vec postoji u bazi
        if ($this->userRepository->findByEmail($command->email) !== null) {
            throw new \InvalidArgumentException("Email '{$command->email}' is already registered.");
        }

        // 2. Samoregistracijom se UVEK dobija najniza uloga.
        // Vise uloge dodeljuje administrator (app:create-admin / admin panel).
        $role = UserRole::Viewer;

        // 3. Napravi "prazan" User objekat samo da bi passwordHasher mogao da radi
        //    (treba mu instancu User-a jer koristi security config za taj tip)
        $tempUser = User::create($command->name, $command->email, '', $role);

        // 4. Hešuj lozinku — bcrypt automatski dodaje "salt" i pravi
        $hashedPassword = $this->passwordHasher->hashPassword($tempUser, $command->plainPassword);

        // 5. Kreiraj pravog korisnika sa hešovanom lozinkom
        $user = User::create($command->name, $command->email, $hashedPassword, $role);

        //6. Sacuvaj u bazu
        $this->userRepository->save($user);
    }

}
