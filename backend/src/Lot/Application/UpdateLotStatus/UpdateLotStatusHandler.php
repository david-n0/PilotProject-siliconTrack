<?php

namespace App\Lot\Application\UpdateLotStatus;

use App\Lot\Domain\LotHistory;
use App\Lot\Domain\LotRepositoryInterface;
use App\Lot\Domain\LotStatus;

class UpdateLotStatusHandler
{

    public function __construct(
        private readonly LotRepositoryInterface $lotRepository,
    )
    {
    }

    public function handle(UpdateLotStatusCommand $command): void
    {
        $lot = $this->lotRepository->findById($command->lotId);
        if ($lot === null) {
            throw new \InvalidArgumentException("Lot #{$command->lotId} not found.");
        }

        $oldStatus = $lot->getStatus()->value;
        $newStatus = LotStatus::from($command->newStatus);

        $lot->changeStatus($newStatus);

        // Automatski zabelezi neizmenjiv audit log
        $history = LotHistory::record(
            lot: $lot,
            fromStatus: $oldStatus,
            toStatus: $newStatus->value,
            changedByEmail: $command->changedByEmail,
            note: $command->note,
        );

        $this->lotRepository->saveHistory($history);
        $this->lotRepository->save($lot);

    }
}
