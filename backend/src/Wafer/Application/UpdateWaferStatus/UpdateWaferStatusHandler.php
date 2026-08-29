<?php

namespace App\Wafer\Application\UpdateWaferStatus;

use App\Lot\Application\AutoHold\AutoHoldResult;
use App\Lot\Application\AutoHold\AutoHoldService;
use App\Wafer\Domain\WaferRepositoryInterface;
use App\Wafer\Domain\WaferStatus;

class UpdateWaferStatusHandler
{
    public function __construct(
        private readonly WaferRepositoryInterface $waferRepository,
        private readonly AutoHoldService          $autoHold
    )
    {
    }

    public function handle(UpdateWaferStatusCommand $command): ?AutoHoldResult
    {
        $wafer = $this->waferRepository->findById($command->waferId);
        if ($wafer === null) {
            throw new \InvalidArgumentException("Wafer #{$command->waferId} not found.");
        }
        // Konvertujemo string u WaferStatus enum
        $newStatus = WaferStatus::from($command->newStatus);
        $wafer->changeStatus($newStatus);
        $this->waferRepository->save($wafer);

        // Ako je plocica vracena u 'ok', yield moze samo da poraste — nema potrebe za proverom.
        if ($newStatus === WaferStatus::Ok) {
            return null;
        }

        return $this->autoHold->evaluate(
            lotId: $wafer->getLot()->getId(),
            triggeredByEmail: $command->changedByEmail,
            trigger: sprintf('Rucna promena statusa plocice %s u %s — razlog: %s',
                $wafer->getSerialNumber(), $newStatus->value, $command->reason ?? 'nije naveden'),
        );
    }
}
