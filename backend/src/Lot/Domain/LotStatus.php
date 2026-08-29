<?php

namespace App\Lot\Domain;

enum LotStatus: string
{
    case Pending = 'pending';
    case InProduction = 'in_production';
    case Hold = 'hold';
    case Completed = 'completed';
    case Rejected = 'rejected';
    
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Pending      => [self::InProduction],
            self::InProduction => [self::Hold, self::Completed, self::Rejected],
            self::Hold         => [self::InProduction, self::Rejected],
            self::Completed, self::Rejected => [],   // finalni statusi
        };
    }

    public function canTransitionTo(self $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions(), true);
    }

    public function isFinal(): bool
    {
        return $this->allowedTransitions() === [];
    }
}
