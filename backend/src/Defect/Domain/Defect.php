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

    // Pozicija defekta na wafer mapi (Die Grid koordinate)
    #[ORM\Column(type: 'integer')]
    private int $dieRow;
    #[ORM\Column(type: 'integer')]
    private int $dieCol;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $detectedAt;

    // Private constructor - jedini nacin kreiranja je Defect::log(...)
    public function __construct(Wafer $wafer, DefectType $type, DefectSeverity $severity, int $dieRow, int $dieCol, ?string $description)
    {
        $this->wafer = $wafer;
        $this->type = $type;
        $this->severity = $severity;
        $this->description = $description;
        $this->dieRow = $dieRow;
        $this->dieCol = $dieCol;
        $this->detectedAt = new \DateTimeImmutable();
    }

    public static function log(Wafer $wafer, DefectType $type, DefectSeverity $severity, int $dieRow = 0, int $dieCol = 0, ?string $description): self
    {
        return new self($wafer, $type, $severity, $dieRow, $dieCol, $description);
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

    public function getDieRow(): int
    {
        return $this->dieRow;
    }

    public function getDieCol(): int
    {
        return $this->dieCol;
    }

    public function getDetectedAt(): \DateTimeImmutable
    {
        return $this->detectedAt;
    }

}
