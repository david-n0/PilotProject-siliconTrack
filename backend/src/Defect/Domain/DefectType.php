<?php

namespace App\Defect\Domain;

enum DefectType: string
{
    case Scratch = 'scratch';
    case Crack = 'crack';
    case Contamination = 'contamination';
    case Particle = 'particle';
    case Other = 'other';
}
