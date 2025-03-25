<?php

namespace App\Entity;

use App\Repository\MensajeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MensajeRepository::class)]
class Mensaje
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'mensajes')]
    private ?Foro $foro = null;

    #[ORM\ManyToOne(inversedBy: 'mensajes')]
    private ?Usuario $usuario = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $contenido = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $fechaEnvio = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getForo(): ?Foro
    {
        return $this->foro;
    }

    public function setForo(?Foro $foro): static
    {
        $this->foro = $foro;

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

    public function getContenido(): ?string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): static
    {
        $this->contenido = $contenido;

        return $this;
    }

    public function getFechaEnvio(): ?\DateTimeImmutable
    {
        return $this->fechaEnvio;
    }

    public function setFechaEnvio(\DateTimeImmutable $fechaEnvio): static
    {
        $this->fechaEnvio = $fechaEnvio;

        return $this;
    }
}
