<?php

namespace App\Wafer\Domain;

use App\Lot\Domain\Lot;
use App\Wafer\Infrastructure\WaferRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WaferRepository::class)]
#[ORM\Table(name: 'wafer')]
class Wafer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    private string $serialNumber;

    #[ORM\Column]
    private int $position;

    #[ORM\Column(type: 'string', enumType: WaferStatus::class)]
    private WaferStatus $status;

    #[ORM\Column(type: 'date_immutable')]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(targetEntity: Lot::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Lot $lot;

    // Privatni konstruktor - forsiramo korišćenje Wafer::create(...)
    private function __construct(
        string      $serialNumber,
        int         $position,
        Lot         $lot,
        WaferStatus $status = WaferStatus::Ok,
    )
    {
        $this->serialNumber = $serialNumber;
        $this->position = $position;
        $this->status = $status;
        $this->lot = $lot;
        $this->createdAt = new \DateTimeImmutable();
    }

    public static function create(
        string $serialNumber,
        int    $position,
        Lot    $lot,
    )
    {
        return new self($serialNumber, $position, $lot);
    }

    public function changeStatus(WaferStatus $newStatus)
    {
        $this->status = $newStatus;
    }

    //Geteri
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSerialNumber(): string
    {
        return $this->serialNumber;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function getStatus(): WaferStatus
    {
        return $this->status;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getLot(): Lot
    {
        return $this->lot;
    }

}
