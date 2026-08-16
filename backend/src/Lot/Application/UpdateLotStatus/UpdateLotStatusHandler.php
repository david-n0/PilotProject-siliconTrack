<?php

namespace App\Lot\Application\UpdateLotStatus;

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
        } else {
            $newStatus = LotStatus::from($command->newStatus);
            $lot->changeStatus($newStatus);
            $this->lotRepository->save($lot);
        }
    }
}
