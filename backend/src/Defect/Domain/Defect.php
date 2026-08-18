<?php

namespace App\Defect\Domain;

use App\Defect\Infrastructure\DefectRepository;
use App\Wafer\Domain\Wafer;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(DefectRepository::class)]
#[ORM\Table(name: 'defect')]
class Defect
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Relacija ka Wafer-u (jedna plocica moze imati vise defekata)
    // CASCADE DELETE: ako se plocica obrise, brisu se i svi njeni defekti
    #[ORM\ManyToOne(targetEntity: Wafer::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Wafer $wafer;

    #[ORM\Column(type: 'string', enumType: DefectType::class)]
    private DefectType $type;

    #[ORM\Column(type: 'string', enumType: DefectSeverity::class)]
    private DefectSeverity $severity;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $description;

    #[ORM\Column(type: 'date_immutable')]
    private \DateTimeImmutable $detectedAt;

    // Private constructor — jedini nacin kreiranja je Defect::log(...)
    public function __construct(Wafer $wafer, DefectType $type, DefectSeverity $severity, ?string $description)
    {
        $this->wafer = $wafer;
        $this->type = $type;
        $this->severity = $severity;
        $this->description = $description;
        $this->detectedAt = new \DateTimeImmutable();
    }

    public static function log(Wafer $wafer, DefectType $type, DefectSeverity $severity, ?string $description): self
    {
        return new self($wafer, $type, $severity, $description);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWafer(): Wafer
    {
        return $this->wafer;
    }

    public function getType(): DefectType
    {
        return $this->type;
    }

    public function getSeverity(): DefectSeverity
    {
        return $this->severity;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getDetectedAt(): \DateTimeImmutable
    {
        return $this->detectedAt;
    }

}
