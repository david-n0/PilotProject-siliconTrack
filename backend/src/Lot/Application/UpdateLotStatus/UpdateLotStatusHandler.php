<?php

namespace App\Lot\Application\UpdateLotStatus;

use App\Lot\Domain\LotHistory;
use App\Lot\Domain\LotRepositoryInterface;
use App\Lot\Domain\LotStatus;

class UpdateLotStatusHandler
{
    // Mapa dozvoljenih tranzicija: iz kog statusa -> u koje statuse moze
    private const ALLOWED_TRANSITIONS = [
        'pending' => ['in_production'],
        'in_production' => ['hold', 'completed', 'rejected'],
        'hold' => ['in_production', 'rejected'],
        'completed' => [],  // Finalni status — nema dalje
        'rejected' => [],  // Finalni status — nema dalje
    ];

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

        // 2. Validacija: Proveri dozvoljene tranzicije
        $allowed = self::ALLOWED_TRANSITIONS[$oldStatus] ?? [];
        if (!in_array($newStatus->value, $allowed, true)) {
            throw new \InvalidArgumentException(
                "Nedozvoljena tranzicija statusa: {$oldStatus} → {$newStatus->value}. " .
                "Dozvoljeni prelazi iz '{$oldStatus}': " . (empty($allowed) ? 'nema (finalni status)' : implode(', ', $allowed))
            );
        }

        // 3. Promeni status
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
