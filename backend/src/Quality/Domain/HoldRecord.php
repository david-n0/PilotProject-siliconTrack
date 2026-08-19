<?php

namespace App\Quality\Domain;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'hold_record')]
class HoldRecord
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private string $holdCode;

    #[ORM\Column(length: 255)]
    private string $lotCode;

    #[ORM\Column(type: 'json')]
    private array $waferSerials = [];

    #[ORM\Column(length: 100)]
    private string $severity;

    #[ORM\Column(type: 'text')]
    private string $reason;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $originatingSignalId = null;

    #[ORM\Column(length: 255)]
    private string $initiatedBy;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $initiatedAt;

    #[ORM\Column(length: 100)]
    private string $status;

    #[ORM\Column]
    private int $affectedPopulationCount;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $synchronizationStatus = null;

    public function __construct(
        string $holdCode,
        string $lotCode,
        array $waferSerials,
        string $severity,
        string $reason,
        string $initiatedBy,
        int $affectedPopulationCount,
        string $status = 'Active'
    ) {
        $this->holdCode = $holdCode;
        $this->lotCode = $lotCode;
        $this->waferSerials = $waferSerials;
        $this->severity = $severity;
        $this->reason = $reason;
        $this->initiatedBy = $initiatedBy;
        $this->affectedPopulationCount = $affectedPopulationCount;
        $this->status = $status;
        $this->initiatedAt = new \DateTimeImmutable();
    }

    public static function create(
        string $holdCode,
        string $lotCode,
        array $waferSerials,
        string $severity,
        string $reason,
        string $initiatedBy,
        int $affectedPopulationCount
    ): self {
        return new self($holdCode, $lotCode, $waferSerials, $severity, $reason, $initiatedBy, $affectedPopulationCount);
    }

    // Getters and Setters...

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHoldCode(): string
    {
        return $this->holdCode;
    }

    public function getLotCode(): string
    {
        return $this->lotCode;
    }

    public function getWaferSerials(): array
    {
        return $this->waferSerials;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function getReason(): string
    {
        return $this->reason;
    }

    public function getOriginatingSignalId(): ?string
    {
        return $this->originatingSignalId;
    }

    public function setOriginatingSignalId(?string $originatingSignalId): void
    {
        $this->originatingSignalId = $originatingSignalId;
    }

    public function getInitiatedBy(): string
    {
        return $this->initiatedBy;
    }

    public function getInitiatedAt(): \DateTimeImmutable
    {
        return $this->initiatedAt;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function changeStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getAffectedPopulationCount(): int
    {
        return $this->affectedPopulationCount;
    }

    public function getSynchronizationStatus(): ?string
    {
        return $this->synchronizationStatus;
    }

    public function setSynchronizationStatus(?string $synchronizationStatus): void
    {
        $this->synchronizationStatus = $synchronizationStatus;
    }
}
