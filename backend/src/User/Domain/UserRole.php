<?php

namespace App\User\Domain;

enum UserRole: string
{
    case User = 'ROLE_USER';
    case Viewer   = 'ROLE_VIEWER';
    case Engineer = 'ROLE_ENGINEER';
    case Admin = 'ROLE_ADMIN';
}
