<?php

namespace App\Lot\Domain;

// Sva SPC pravila na jednom mestu. Bez baze, bez frameworka - cista logika.
final class YieldPolicy
{
    public const UCL = 95.0;      // Upper Control Limit (cilj)
    public const LCL = 75.0;      // Lower Control Limit - ispod ovoga ide AUTO-HOLD
    public const MIN_SAMPLE = 2;  // ne sudimo seriji sa premalo evidentiranih plocica

    public static function calculate(int $okWafers, int $totalWafers): float
    {
        if ($totalWafers === 0) {
            return 100.0;
        }
        return round(($okWafers / $totalWafers) * 100, 1);
    }

    public static function breachesLcl(float $yieldPercent, int $totalWafers): bool
    {
        return $totalWafers >= self::MIN_SAMPLE && $yieldPercent < self::LCL;
    }
}
