<?php

namespace App\Lot\Domain;

use App\Lot\Infrastructure\LotRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LotRepository::class)]
class Lot
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $lotNumber = null;

    #[ORM\Column(enumType: LotStatus::class)]
    private ?LotStatus $status = null;

    #[ORM\Column]
    private ?int $waferCount = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $startedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $completedAt = null;

    #[ORM\Column(length: 255)]
    private ?string $product = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $createdBy = null;

    /**
     * @param string|null $lotNumber
     * @param int|null $waferCount
     * @param string|null $product
     */
    public function __construct(?string $lotNumber, ?string $product, ?int $waferCount, string $createdBy)
    {
        $this->lotNumber = $lotNumber;
        $this->product = $product;
        $this->waferCount = $waferCount;
        $this->createdBy = $createdBy;
        $this->status = LotStatus::Pending; //Always starts as pending
        $this->startedAt = new \DateTimeImmutable(); //Starts now
    }

    public static function create(string $lotNumber, string $product, int $waferCount, string $createdBy = 'system'): self
    {
        return new self($lotNumber, $product, $waferCount, $createdBy);
    }

    public function changeStatus(LotStatus $newStatus): void
    {
        if (!$this->status->canTransitionTo($newStatus)) {
            throw new InvalidLotTransitionException($this->status, $newStatus);
        }

        $this->status = $newStatus;

        if ($newStatus === LotStatus::Completed || $newStatus === LotStatus::Rejected) {
            $this->completedAt = new \DateTimeImmutable();
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLotNumber(): ?string
    {
        return $this->lotNumber;
    }


    public function getStatus(): ?LotStatus
    {
        return $this->status;
    }


    public function getWaferCount(): ?int
    {
        return $this->waferCount;
    }


    public function getStartedAt(): ?\DateTimeImmutable
    {
        return $this->startedAt;
    }


    public function getCompletedAt(): ?\DateTimeImmutable
    {
        return $this->completedAt;
    }


    public function getProduct(): ?string
    {
        return $this->product;
    }


    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }


}
