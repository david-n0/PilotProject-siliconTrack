<?php

namespace App\Wafer\Domain;

enum WaferStatus: string
{
    case Ok        = 'ok';        // Plocica je ispravna i u procesu
    case Defective = 'defective'; // Uocen defekt tokom kontrole
    case Scrapped  = 'scrapped';  // Odbacena / neupotrebljiva plocica
}
