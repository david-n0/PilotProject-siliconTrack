<?php

namespace App\Quality\Domain;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'nonconformance_record')]
class NonconformanceRecord
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private string $ncrCode;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $holdCode = null;

    #[ORM\Column(length: 255)]
    private string $lotCode;

    #[ORM\Column(length: 255)]
    private string $productCode;

    #[ORM\Column(length: 255)]
    private string $operationCode;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $equipmentCode = null;

    #[ORM\Column(length: 100)]
    private string $severity;

    #[ORM\Column(type: 'text')]
    private string $problemStatement;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $containmentAction = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $rootCauseMethod = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $whys = [];

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $fishbone = [];

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $candidateCause = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $verifiedRootCause = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $disposition = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $reworkInstructions = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $mrbApprovals = [];

    #[ORM\Column(length: 100)]
    private string $status;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    public function __construct(
        string $ncrCode,
        string $lotCode,
        string $productCode,
        string $operationCode,
        string $severity,
        string $problemStatement,
        string $status = 'Open'
    ) {
        $this->ncrCode = $ncrCode;
        $this->lotCode = $lotCode;
        $this->productCode = $productCode;
        $this->operationCode = $operationCode;
        $this->severity = $severity;
        $this->problemStatement = $problemStatement;
        $this->status = $status;
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters and Setters omitted for brevity, adding standard ones.

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNcrCode(): string
    {
        return $this->ncrCode;
    }

    public function getHoldCode(): ?string
    {
        return $this->holdCode;
    }

    public function setHoldCode(?string $holdCode): void
    {
        $this->holdCode = $holdCode;
    }

    public function getLotCode(): string
    {
        return $this->lotCode;
    }

    public function getProductCode(): string
    {
        return $this->productCode;
    }

    public function getOperationCode(): string
    {
        return $this->operationCode;
    }

    public function getEquipmentCode(): ?string
    {
        return $this->equipmentCode;
    }

    public function setEquipmentCode(?string $equipmentCode): void
    {
        $this->equipmentCode = $equipmentCode;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function getProblemStatement(): string
    {
        return $this->problemStatement;
    }

    public function getContainmentAction(): ?string
    {
        return $this->containmentAction;
    }

    public function setContainmentAction(?string $containmentAction): void
    {
        $this->containmentAction = $containmentAction;
    }

    public function getRootCauseMethod(): ?string
    {
        return $this->rootCauseMethod;
    }

    public function setRootCauseMethod(?string $rootCauseMethod): void
    {
        $this->rootCauseMethod = $rootCauseMethod;
    }

    public function getWhys(): ?array
    {
        return $this->whys;
    }

    public function setWhys(?array $whys): void
    {
        $this->whys = $whys;
    }

    public function getFishbone(): ?array
    {
        return $this->fishbone;
    }

    public function setFishbone(?array $fishbone): void
    {
        $this->fishbone = $fishbone;
    }

    public function getCandidateCause(): ?string
    {
        return $this->candidateCause;
    }

    public function setCandidateCause(?string $candidateCause): void
    {
        $this->candidateCause = $candidateCause;
    }

    public function getVerifiedRootCause(): ?string
    {
        return $this->verifiedRootCause;
    }

    public function setVerifiedRootCause(?string $verifiedRootCause): void
    {
        $this->verifiedRootCause = $verifiedRootCause;
    }

    public function getDisposition(): ?string
    {
        return $this->disposition;
    }

    public function setDisposition(?string $disposition): void
    {
        $this->disposition = $disposition;
    }

    public function getReworkInstructions(): ?string
    {
        return $this->reworkInstructions;
    }

    public function setReworkInstructions(?string $reworkInstructions): void
    {
        $this->reworkInstructions = $reworkInstructions;
    }

    public function getMrbApprovals(): ?array
    {
        return $this->mrbApprovals;
    }

    public function setMrbApprovals(?array $mrbApprovals): void
    {
        $this->mrbApprovals = $mrbApprovals;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function changeStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
