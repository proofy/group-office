<?php

namespace Guzzle\Http\Message\Header;

/**
 * Interface for creating headers
 */
interface HeaderFactoryInterface
{
    /**
     * Create a header from a header name and a single value
     *
     * @param StringHelper $header Name of the header to create
     * @param StringHelper $value  Value to set on the header
     *
     * @return HeaderInterface
     */
    public function createHeader($header, $value = null);
}
