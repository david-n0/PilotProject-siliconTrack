<?php

namespace App\Defect\Application\LogDefect;

class LogDefectCommand
{

    public function __construct(
        public readonly int     $waferId,
        public readonly string  $type, // scratch,crack...
        public readonly string  $severity, // minor, major
        public readonly int     $dieRow = 0,
        public readonly int     $dieCol = 0,
        public readonly ?string $description = null,
        public readonly string  $loggedByEmail = 'system',
    )
    {
    }
}
