<?php

namespace Guzzle\Http\Message;

use Guzzle\Common\Exception\InvalidArgumentException;

/**
 * POST file upload
 */
interface PostFileInterface
{
    /**
     * Set the name of the field
     *
     * @param StringHelper $name Field name
     *
     * @return self
     */
    public function setFieldName($name);

    /**
     * Get the name of the field
     *
     * @return StringHelper
     */
    public function getFieldName();

    /**
     * Set the path to the file
     *
     * @param StringHelper $path Full path to the file
     *
     * @return self
     * @throws InvalidArgumentException if the file cannot be read
     */
    public function setFilename($path);

    /**
     * Set the post name of the file
     *
     * @param StringHelper $name The new name of the file
     *
     * @return self
     */
    public function setPostname($name);

    /**
     * Get the full path to the file
     *
     * @return StringHelper
     */
    public function getFilename();

    /**
     * Get the post name of the file
     *
     * @return StringHelper
     */
    public function getPostname();

    /**
     * Set the Content-Type of the file
     *
     * @param StringHelper $type Content type
     *
     * @return self
     */
    public function setContentType($type);

    /**
     * Get the Content-Type of the file
     *
     * @return StringHelper
     */
    public function getContentType();

    /**
     * Get a cURL ready string or CurlFile object for the upload
     *
     * @return StringHelper
     */
    public function getCurlValue();
}
