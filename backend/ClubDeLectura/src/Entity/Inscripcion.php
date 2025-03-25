<?php

namespace App\Entity;

use App\Repository\InscripcionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InscripcionRepository::class)]
class Inscripcion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'inscripcions')]
    private ?Evento $evento = null;

    #[ORM\ManyToOne(inversedBy: 'inscripcions')]
    private ?Usuario $usuario = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $fechaInscripcion = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEvento(): ?Evento
    {
        return $this->evento;
    }

    public function setEvento(?Evento $evento): static
    {
        $this->evento = $evento;

        return $this;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getFechaInscripcion(): ?\DateTimeImmutable
    {
        return $this->fechaInscripcion;
    }

    public function setFechaInscripcion(\DateTimeImmutable $fechaInscripcion): static
    {
        $this->fechaInscripcion = $fechaInscripcion;

        return $this;
    }
}
