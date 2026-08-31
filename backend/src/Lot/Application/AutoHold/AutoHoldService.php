<?php

namespace App\Lot\Application\AutoHold;

use App\Lot\Application\UpdateLotStatus\UpdateLotStatusCommand;
use App\Lot\Application\UpdateLotStatus\UpdateLotStatusHandler;
use App\Lot\Domain\LotRepositoryInterface;
use App\Lot\Domain\LotStatus;
use App\Lot\Domain\YieldPolicy;
use App\Wafer\Domain\WaferRepositoryInterface;
use App\Wafer\Domain\WaferStatus;

final class AutoHoldService
{
    public function __construct(
        private readonly LotRepositoryInterface   $lots,
        private readonly WaferRepositoryInterface $wafers,
        private readonly UpdateLotStatusHandler   $updateLotStatus,
    )
    {
    }

    // Vraca AutoHoldResult ako je serija zaustavljena, ili null ako nema razloga.
    public function evaluate(int $lotId, string $triggeredByEmail, string $trigger): ?AutoHoldResult
    {
        $lot = $this->lots->findById($lotId);
        if ($lot === null) {
            return null;
        }

        // GUARD 1: samo 'in_production' sme na 'hold' (vidi ALLOWED_TRANSITIONS).
        // Ovo ujedno resava i idempotenciju - vec zaustavljenu seriju ne diramo ponovo.
        if ($lot->getStatus() !== LotStatus::InProduction) {
            return null;
        }

        $waferList = $this->wafers->findByLotId($lotId);
        $total = count($waferList);
        $ok = count(array_filter($waferList, fn($w) => $w->getStatus() === WaferStatus::Ok));
        $yield = YieldPolicy::calculate($ok, $total);

        // GUARD 2: da li je kontrolna granica stvarno prekrsena
        if (!YieldPolicy::breachesLcl($yield, $total)) {
            return null;
        }

        $note = sprintf(
            'AUTO-HOLD: Yield %.1f%% je ispod LCL %.1f%% (%d/%d OK). Okidac: %s. Prijavio: %s.',
            $yield, YieldPolicy::LCL, $ok, $total, $trigger, $triggeredByEmail
        );

        // Idemo kroz postojeci handler - tako tranzicije i audit ostaju na jednom mestu.
        $this->updateLotStatus->handle(new UpdateLotStatusCommand(
            lotId: $lotId,
            newStatus: LotStatus::Hold->value,
            changedByEmail: 'system@silicontrack',
            note: $note,
        ));

        return new AutoHoldResult($lotId, $yield, $note);
    }
}
