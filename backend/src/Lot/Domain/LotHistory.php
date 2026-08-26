<?php

namespace App\Lot\Domain;

use Doctrine\ORM\Mapping as ORM;


// LotHistory — Nepromenjivi (Immutable) Audit Trail za promene statusa serije.
// Svaka promena statusa automatski belezi: ko, sta, kada i zašto (note).

#[ORM\Entity]
#[ORM\Table(name: 'lot_history')]
class LotHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Lot::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Lot $lot;

    #[ORM\Column(length: 50)]
    private string $fromStatus;

    #[ORM\Column(length: 50)]
    private string $toStatus;

    #[ORM\Column(length: 180)]
    private string $changedByEmail;

    #[ORM\Column]
    private \DateTimeImmutable $changedAt;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $note;

    private function __construct(
        Lot     $lot,
        string  $fromStatus,
        string  $toStatus,
        string  $changedByEmail,
        ?string $note
    ) {
        $this->lot            = $lot;
        $this->fromStatus     = $fromStatus;
        $this->toStatus       = $toStatus;
        $this->changedByEmail = $changedByEmail;
        $this->changedAt      = new \DateTimeImmutable();
        $this->note           = $note;
    }

    public static function record(
        Lot     $lot,
        string  $fromStatus,
        string  $toStatus,
        string  $changedByEmail,
        ?string $note = null
    ): self {
        return new self($lot, $fromStatus, $toStatus, $changedByEmail, $note);
    }

    public function getId(): ?int { return $this->id; }
    public function getLot(): Lot { return $this->lot; }
    public function getFromStatus(): string { return $this->fromStatus; }
    public function getToStatus(): string { return $this->toStatus; }
    public function getChangedByEmail(): string { return $this->changedByEmail; }
    public function getChangedAt(): \DateTimeImmutable { return $this->changedAt; }
    public function getNote(): ?string { return $this->note; }
}
