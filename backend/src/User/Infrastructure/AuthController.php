<?php

namespace App\User\Infrastructure;

use App\User\Application\RegisterUser\RegisterUserCommand;
use App\User\Application\RegisterUser\RegisterUserHandler;
use App\User\Domain\UserRepositoryInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    // POST /api/login
    // Rucno proveravamo email + lozinku, pa generišemo JWT token
    // Body: { "email": "...", "password": "..." }
    #[Route('/login', methods: ['POST'])]
    public function login(
        Request                     $request,
        UserRepositoryInterface     $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface    $jwtManager  // Lexik JWT servis koji kreira token
    ): JsonResponse
    {
        $body = json_decode($request->getContent(), true);
        if (empty($body['email']) || empty($body['password'])) {
            return $this->json(
                ['message' => 'Email and password are required.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        // 1. Pronadji korisnika u bazi po email-u
        $user = $userRepository->findByEmail($body['email']);
        // 2. Proveri da li korisnik postoji i da li se lozinka poklapa
        //    isPasswordValid() poredi plain text sa bcrypt hashom iz baze
        if (!$user || !$passwordHasher->isPasswordValid($user, $body['password'])) {
            return $this->json(
                ['message' => 'Invalid credentials.'],
                Response::HTTP_UNAUTHORIZED
            );
        }
        // 3. Generisi JWT token koji sadrzi email i role korisnika
        $token = $jwtManager->create($user);
        return $this->json(['token' => $token]);
    }

    // POST /api/register
    // Body: { "email": "...", "name": "...", "password": "...", "role": "ROLE_ENGINEER" }
    // Ne treba nam endpoint za login jer to Symfony Security radi automatski!
    // security.yaml podesava /api/login i Lexik JWT bundle vraca token.
    #[Route('/register', methods: ['POST'])]
    public function register(Request $request, RegisterUserHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);
        // Osnovna validacija — provjeri da li su prisutna obavezna polja
        if (empty($body['email']) || empty($body['name']) || empty($body['password'])) {
            return $this->json(
                ['error' => 'Fields email, name and password are required.'],
                Response::HTTP_BAD_REQUEST
            );
        }
        try {
            $handler->handle(new RegisterUserCommand(
                email: $body['email'],
                name: $body['name'],
                plainPassword: $body['password'],
                role: $body['role'] ?? 'ROLE_ENGINEER', // ako ne posaljes, dobija Engineer
            ));
            return $this->json(
                ['message' => 'User registered successfully.'],
                Response::HTTP_CREATED
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_CONFLICT); // 409
        } catch (\ValueError $e) {
            return $this->json(['error' => 'Invalid role value.'], Response::HTTP_BAD_REQUEST);
        }

    }

    // GET /api/me
    // Vraca podatke o trenutno ulogovanom korisniku (iz JWT tokena)
    // Samo korisnici sa validnim JWT tokenom mogu pristupiti ovoj ruti
    #[Route('/me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        // $this->getUser() dolazi od Symfony Security — čita korisnika iz JWT tokena
        /** @var \App\User\Domain\User $user */
        $user = $this->getUser();
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
        ]);
    }

}
