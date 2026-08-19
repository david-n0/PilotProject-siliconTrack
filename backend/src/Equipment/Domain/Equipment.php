<?php

namespace App\Equipment\Domain;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'equipment')]
class Equipment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private string $code;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $type;

    #[ORM\Column(length: 255)]
    private string $vendor;

    #[ORM\Column(length: 255)]
    private string $model;

    #[ORM\Column(length: 255)]
    private string $site;

    #[ORM\Column(length: 255)]
    private string $area;

    #[ORM\Column(length: 100)]
    private string $status;

    #[ORM\Column(type: 'date_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastMaintenanceDate = null;

    #[ORM\Column(type: 'date_immutable', nullable: true)]
    private ?\DateTimeImmutable $nextCalibrationDueDate = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $chambers = [];

    public function __construct(
        string $code,
        string $name,
        string $type,
        string $vendor,
        string $model,
        string $site,
        string $area,
        string $status = 'Active'
    ) {
        $this->code = $code;
        $this->name = $name;
        $this->type = $type;
        $this->vendor = $vendor;
        $this->model = $model;
        $this->site = $site;
        $this->area = $area;
        $this->status = $status;
    }

    public static function create(
        string $code,
        string $name,
        string $type,
        string $vendor,
        string $model,
        string $site,
        string $area,
        string $status = 'Active'
    ): self {
        return new self($code, $name, $type, $vendor, $model, $site, $area, $status);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getVendor(): string
    {
        return $this->vendor;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function getSite(): string
    {
        return $this->site;
    }

    public function getArea(): string
    {
        return $this->area;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function changeStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getLastMaintenanceDate(): ?\DateTimeImmutable
    {
        return $this->lastMaintenanceDate;
    }

    public function setLastMaintenanceDate(?\DateTimeImmutable $lastMaintenanceDate): void
    {
        $this->lastMaintenanceDate = $lastMaintenanceDate;
    }

    public function getNextCalibrationDueDate(): ?\DateTimeImmutable
    {
        return $this->nextCalibrationDueDate;
    }

    public function setNextCalibrationDueDate(?\DateTimeImmutable $nextCalibrationDueDate): void
    {
        $this->nextCalibrationDueDate = $nextCalibrationDueDate;
    }

    public function getChambers(): ?array
    {
        return $this->chambers;
    }

    public function setChambers(?array $chambers): void
    {
        $this->chambers = $chambers;
    }
}
