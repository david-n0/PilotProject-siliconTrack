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

        // Validacija: Komentar je obavezan
        if (empty(trim($command->note ?? ''))) {
            throw new \InvalidArgumentException('Komentar je obavezan pri svakoj promeni statusa.');
        }

        $oldStatus = $lot->getStatus()->value;
        $newStatus = LotStatus::from($command->newStatus);

        // 3. Promeni status / Pravila prelaza su u agregatu — ovde samo orkestracija.
        $lot->changeStatus($newStatus);

        // 4. Zabelezi neizmenjiv audit log
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
