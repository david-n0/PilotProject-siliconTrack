<?php

namespace App\Wafer\Application\UpdateWaferStatus;

use App\Wafer\Domain\WaferRepositoryInterface;
use App\Wafer\Domain\WaferStatus;

class UpdateWaferStatusHandler
{
    public function __construct(
        private readonly WaferRepositoryInterface $waferRepository
    )
    {
    }

    public function handle(UpdateWaferStatusCommand $command): void
    {
        $wafer = $this->waferRepository->findById($command->waferId);
        if ($wafer === null) {
            throw new \InvalidArgumentException("Wafer #{$command->waferId} not found.");
        }
        // Konvertujemo string u WaferStatus enum
        $newStatus = WaferStatus::from($command->newStatus);
        $wafer->changeStatus($newStatus);
        $this->waferRepository->save($wafer);
    }
}
