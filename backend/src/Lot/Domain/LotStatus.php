<?php

namespace App\Lot\Domain;

enum LotStatus: string
{
    case Pending = 'pending';
    case InProduction = 'in_production';
    case Hold = 'hold';
    case Completed = 'completed';
    case Rejected = 'rejected';
}
