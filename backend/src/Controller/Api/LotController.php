<?php
namespace App\Controller\Api;

use App\Entity\Lot;
use App\Repository\LotRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Glavna ruta za sve funkcije u ovom kontroleru
#[Route('/api/lots')]
class LotController extends AbstractController
{
    /*
     1. GET METODA - Dohvata sve Lot-ove iz baze
     */
    #[Route('', name: 'api_lots_index', methods: ['GET'])]
    public function index(LotRepository $lotRepository): JsonResponse
    {
        // Tražimo sve podatke iz tabele 'lot'
        $lots = $lotRepository->findAll();

        $data = [];
        foreach ($lots as $lot) {
            $data[] = [
                'id' => $lot->getId(),
                'code' => $lot->getCode(),
                'quantity' => $lot->getQuantity(),
            ];
        }

        // Vraćamo podatke u JSON formatu
        return $this->json($data);
    }

    /*
     2. POST METODA - Pravi novi Lot u bazi (poziva se iz React forme)
     */
    #[Route('', name: 'api_lots_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Prihvatamo JSON koji nam šalje React
        $podaci = json_decode($request->getContent(), true);

        // Pravimo novi objekat
        $lot = new Lot();
        $lot->setCode($podaci['code'] ?? 'NEPOZNATO');
        $lot->setQuantity($podaci['quantity'] ?? 0);

        // Snimamo ga u bazu
        $em->persist($lot);
        $em->flush();

        return $this->json([
            'poruka' => 'Lot je uspešno kreiran!',
            'id' => $lot->getId()
        ], Response::HTTP_CREATED);
    }

    /*
     3. GET METODA - Dohvata samo jedan konkretan Lot po ID-u
     */
    #[Route('/{id}', name: 'api_lots_show', methods: ['GET'])]
    public function show(int $id, LotRepository $lotRepository): JsonResponse
    {
        $lot = $lotRepository->find($id);

        if (!$lot) {
            return $this->json(['greška' => 'Lot nije pronađen'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $lot->getId(),
            'code' => $lot->getCode(),
            'quantity' => $lot->getQuantity(),
        ]);
    }

    /*
     4. DELETE METODA - Briše Lot po ID-u
     */
    #[Route('/{id}', name: 'api_lots_delete', methods: ['DELETE'])]
    public function delete(int $id, LotRepository $lotRepository, EntityManagerInterface $em): JsonResponse
    {
        $lot = $lotRepository->find($id);

        if (!$lot) {
            return $this->json(['greška' => 'Lot nije pronađen'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($lot);
        $em->flush();

        return $this->json(['poruka' => 'Lot je uspešno obrisan']);
    }
}
