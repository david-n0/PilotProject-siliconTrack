<?php

namespace App\Spc\Domain;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'spc_signal')]
class SpcSignal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $chartName;

    #[ORM\Column(length: 255)]
    private string $parameterName;

    #[ORM\Column(length: 255)]
    private string $operationCode;

    #[ORM\Column(length: 255)]
    private string $equipmentCode;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $recipeCode = null;

    #[ORM\Column(length: 100)]
    private string $severity;

    #[ORM\Column(type: 'text')]
    private string $ruleViolated;

    #[ORM\Column(length: 255)]
    private string $lotCode;

    #[ORM\Column(length: 100)]
    private string $status;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $timestamp;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $cpk = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $acknowledgedBy = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $acknowledgedAt = null;

    public function __construct(
        string $chartName,
        string $parameterName,
        string $operationCode,
        string $equipmentCode,
        string $severity,
        string $ruleViolated,
        string $lotCode,
        string $status = 'Active'
    ) {
        $this->chartName = $chartName;
        $this->parameterName = $parameterName;
        $this->operationCode = $operationCode;
        $this->equipmentCode = $equipmentCode;
        $this->severity = $severity;
        $this->ruleViolated = $ruleViolated;
        $this->lotCode = $lotCode;
        $this->status = $status;
        $this->timestamp = new \DateTimeImmutable();
    }

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChartName(): string
    {
        return $this->chartName;
    }

    public function getParameterName(): string
    {
        return $this->parameterName;
    }

    public function getOperationCode(): string
    {
        return $this->operationCode;
    }

    public function getEquipmentCode(): string
    {
        return $this->equipmentCode;
    }

    public function getRecipeCode(): ?string
    {
        return $this->recipeCode;
    }

    public function setRecipeCode(?string $recipeCode): void
    {
        $this->recipeCode = $recipeCode;
    }

    public function getSeverity(): string
    {
        return $this->severity;
    }

    public function getRuleViolated(): string
    {
        return $this->ruleViolated;
    }

    public function getLotCode(): string
    {
        return $this->lotCode;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function changeStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getTimestamp(): \DateTimeImmutable
    {
        return $this->timestamp;
    }

    public function getCpk(): ?float
    {
        return $this->cpk;
    }

    public function setCpk(?float $cpk): void
    {
        $this->cpk = $cpk;
    }

    public function getAcknowledgedBy(): ?string
    {
        return $this->acknowledgedBy;
    }

    public function setAcknowledgedBy(?string $acknowledgedBy): void
    {
        $this->acknowledgedBy = $acknowledgedBy;
    }

    public function getAcknowledgedAt(): ?\DateTimeImmutable
    {
        return $this->acknowledgedAt;
    }

    public function setAcknowledgedAt(?\DateTimeImmutable $acknowledgedAt): void
    {
        $this->acknowledgedAt = $acknowledgedAt;
    }
}
