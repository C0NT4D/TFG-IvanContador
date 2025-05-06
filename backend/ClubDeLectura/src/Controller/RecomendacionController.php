<?php

namespace App\Controller;

use App\Entity\Recomendacion;
use App\Repository\RecomendacionRepository;
use App\Repository\LibroRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

final class RecomendacionController extends AbstractController
{
    private $recomendacionRepository;
    private $libroRepository;
    private $usuarioRepository;
    private $entityManager;

    public function __construct(
        RecomendacionRepository $recomendacionRepository,
        LibroRepository $libroRepository,
        UsuarioRepository $usuarioRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->recomendacionRepository = $recomendacionRepository;
        $this->libroRepository = $libroRepository;
        $this->usuarioRepository = $usuarioRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/recomendaciones', name: 'get_recomendaciones', methods: ['GET'])]
    public function getRecomendaciones(): JsonResponse
    {
        $recomendaciones = $this->recomendacionRepository->findAll();

        $data = [];
        foreach ($recomendaciones as $recomendacion) {
            $data[] = [
                'id' => $recomendacion->getId(),
                'usuario' => [
                    'id' => $recomendacion->getUsuario()->getId(),
                    'nombre' => $recomendacion->getUsuario()->getNombre()
                ],
                'libro' => [
                    'id' => $recomendacion->getLibro()->getId(),
                    'titulo' => $recomendacion->getLibro()->getTitulo()
                ],
                'comentario' => $recomendacion->getComentario(),
                'fecha' => $recomendacion->getFecha()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/recomendacion/{id}', name: 'get_recomendacion', methods: ['GET'])]
    public function getRecomendacion(int $id): JsonResponse
    {
        $recomendacion = $this->recomendacionRepository->find($id);

        if (!$recomendacion) {
            return $this->json(['message' => 'Recomendación no encontrada'], 404);
        }

        return $this->json([
            'id' => $recomendacion->getId(),
            'usuario' => [
                'id' => $recomendacion->getUsuario()->getId(),
                'nombre' => $recomendacion->getUsuario()->getNombre()
            ],
            'libro' => [
                'id' => $recomendacion->getLibro()->getId(),
                'titulo' => $recomendacion->getLibro()->getTitulo()
            ],
            'comentario' => $recomendacion->getComentario(),
            'fecha' => $recomendacion->getFecha()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/recomendacion', name: 'create_recomendacion', methods: ['POST'])]
    public function createRecomendacion(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $libro = $this->libroRepository->find($data['libroId']);
        $usuario = $this->usuarioRepository->find($data['usuarioId']);

        if (!$libro || !$usuario) {
            return $this->json(['message' => 'Libro o usuario no encontrado'], 404);
        }

        $recomendacion = new Recomendacion();
        $recomendacion->setUsuario($usuario);
        $recomendacion->setLibro($libro);
        $recomendacion->setComentario($data['comentario']);
        $recomendacion->setFecha(new \DateTimeImmutable());

        $this->entityManager->persist($recomendacion);
        $this->entityManager->flush();

        return $this->json([
            'id' => $recomendacion->getId(),
            'usuario' => [
                'id' => $recomendacion->getUsuario()->getId(),
                'nombre' => $recomendacion->getUsuario()->getNombre()
            ],
            'libro' => [
                'id' => $recomendacion->getLibro()->getId(),
                'titulo' => $recomendacion->getLibro()->getTitulo()
            ],
            'comentario' => $recomendacion->getComentario(),
            'fecha' => $recomendacion->getFecha()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/recomendacion/{id}', name: 'update_recomendacion', methods: ['PUT'])]
    public function updateRecomendacion(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $recomendacion = $this->recomendacionRepository->find($id);

        if (!$recomendacion) {
            return $this->json(['message' => 'Recomendación no encontrada'], 404);
        }

        $libro = $this->libroRepository->find($data['libroId']);
        $usuario = $this->usuarioRepository->find($data['usuarioId']);

        if (!$libro || !$usuario) {
            return $this->json(['message' => 'Libro o usuario no encontrado'], 404);
        }

        $recomendacion->setUsuario($usuario);
        $recomendacion->setLibro($libro);
        $recomendacion->setComentario($data['comentario']);
        $recomendacion->setFecha(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json([
            'id' => $recomendacion->getId(),
            'usuario' => [
                'id' => $recomendacion->getUsuario()->getId(),
                'nombre' => $recomendacion->getUsuario()->getNombre()
            ],
            'libro' => [
                'id' => $recomendacion->getLibro()->getId(),
                'titulo' => $recomendacion->getLibro()->getTitulo()
            ],
            'comentario' => $recomendacion->getComentario(),
            'fecha' => $recomendacion->getFecha()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/recomendacion/{id}', name: 'delete_recomendacion', methods: ['DELETE'])]
    public function deleteRecomendacion(int $id): JsonResponse
    {
        $recomendacion = $this->recomendacionRepository->find($id);

        if (!$recomendacion) {
            return $this->json(['message' => 'Recomendación no encontrada'], 404);
        }

        $this->entityManager->remove($recomendacion);
        $this->entityManager->flush();

        return $this->json(['message' => 'Recomendación eliminada con éxito']);
    }
}
