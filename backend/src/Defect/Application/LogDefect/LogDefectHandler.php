<?php

namespace App\Defect\Application\LogDefect;

use App\Defect\Domain\Defect;
use App\Defect\Domain\DefectRepositoryInterface;
use App\Defect\Domain\DefectSeverity;
use App\Defect\Domain\DefectType;
use App\Wafer\Domain\WaferRepositoryInterface;
use App\Wafer\Domain\WaferStatus;

class LogDefectHandler
{

    public function __construct(
        private readonly DefectRepositoryInterface $defectRepository,
        private readonly WaferRepositoryInterface  $waferRepository)
    {
    }

    public function handle(LogDefectCommand $command): void
    {
        //1. Pronadji plocicu u bazi
        $wafer = $this->waferRepository->findById($command->waferId);
        if ($wafer === null) {
            throw new \InvalidArgumentException("Wafer #{$command->waferId} not found");
        }

        //2. Konvertuj stringove u enume
        $type = DefectType::from($command->type);
        $severity = DefectSeverity::from($command->severity);

        //3. Kreiraj defekt koristeci factory medtodu
        $defect = Defect::log($wafer, $type, $severity, $command->description);

        //4. Automatski promeni status procice u "defective", cim se zabelezi defect. plocica vise nije ok
        $wafer->changeStatus(WaferStatus::Defective);
        $this->waferRepository->save($wafer);

        //5. Sacuvaj defect
        $this->defectRepository->save($defect);

    }

}
