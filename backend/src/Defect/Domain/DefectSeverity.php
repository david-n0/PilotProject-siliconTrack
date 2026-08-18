<?php

namespace App\Defect\Domain;

enum DefectSeverity: string
{
    case Minor = 'minor';
    case Major = 'major';
    case Critical = 'critical';
}
