<?php

namespace Guzzle\Service\Command\Factory;

use Guzzle\Service\Command\CommandInterface;

/**
 * Interface for creating commands by name
 */
interface FactoryInterface
{
    /**
     * Create a command by name
     *
     * @param StringHelper $name Command to create
     * @param array  $args Command arguments
     *
     * @return CommandInterface|null
     */
    public function factory($name, array $args = array());
}
