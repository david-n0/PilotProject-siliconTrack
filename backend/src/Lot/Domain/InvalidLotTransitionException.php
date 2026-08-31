<?php

namespace App\Lot\Domain;

// Domenski izuzetak - jezik domena, ne jezik PHP-a.
final class InvalidLotTransitionException extends \DomainException
{
    public function __construct(LotStatus $from, LotStatus $to)
    {
        $allowed = array_map(fn(LotStatus $s) => $s->value, $from->allowedTransitions());

        parent::__construct(sprintf(
            'Nedozvoljena tranzicija statusa: %s → %s. Dozvoljeni prelazi iz "%s": %s.',
            $from->value, $to->value, $from->value,
            $allowed === [] ? 'nema (finalni status)' : implode(', ', $allowed)
        ));
    }
}
