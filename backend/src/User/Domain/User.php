<?php

namespace App\User\Domain;

use App\User\Infrastructure\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

// UserInterface — Symfony zna da ovo može biti "korisnik sistema"
// PasswordAuthenticatedUserInterface — Symfony zna da ima lozinku
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]  // navodnici jer je 'user' rezervisana rec u MySQL
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private string $email;

    #[ORM\Column(length: 100)]
    private string $name;

    // Lozinka se cuva hashirana (bcrypt) — nikada plain text!
    //Symfony PasswordHasher pravi npr: $2y$13$xKp... od "password123"
    #[ORM\Column]
    private string $password;

    // Uloge su niz stringova: ['ROLE_ADMIN'] ili ['ROLE_ENGINEER']
    // Symfony uvek automatski dodaje ROLE_USER uz svaku drugu ulogu
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    // Private constructor — jedini nacin kreiranja je User::create(...)
    private function __construct(string $name, string $email, string $hashedPassword, UserRole $role)
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $hashedPassword;
        $this->roles = [$role->value];
    }

    // Factory metoda — ista DDD logika kao i za Lot/Wafer/Defect
    public static function create(string $name, string $email, string $hashedPassword, UserRole $role): self
    {
        return new self($name, $email, $hashedPassword, $role);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getName(): string
    {
        return $this->name;
    }

    // Symfony trazi ovu metodu — vraca hesovanu lozinku iz baze
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function changeRole(UserRole $role): void
    {
        if ($role === UserRole::User) {
            throw new \DomainException('ROLE_USER se ne dodeljuje rucno.');
        }
        $this->roles = [$role->value];
    }

    // Symfony traži ovu metodu — vraća niz uloga
    // array_unique sprečava duplikate ako 'ROLE_USER' već postoji u nizu
    public function getRoles(): array
    {
        $roles = $this->roles;
        // Symfony konvencija: svaki korisnik mora imati ROLE_USER
        $roles[] = UserRole::User->value;
        return array_unique($roles);
    }

    // Symfony trazi ovu metodu — brise osetljive podatke iz memorije posle autentifikacije
    // Mi ne cuvamo plain text lozinku, pa je prazna
    public function eraseCredentials(): void
    {
        // ništa — ne cuvamo plain text lozinku nigde
    }

    // Symfony trazi ovu metodu — koja vrednost jednoznačno identifikuje korisnika?
    // Mi koristimo email (podeseno i u security.yaml)
    public function getUserIdentifier(): string
    {
        return $this->email;
    }
}
