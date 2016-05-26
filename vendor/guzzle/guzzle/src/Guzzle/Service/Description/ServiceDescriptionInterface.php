<?php

namespace Guzzle\Service\Description;

/**
 * A ServiceDescription stores service information based on a service document
 */
interface ServiceDescriptionInterface extends \Serializable
{
    /**
     * Get the basePath/baseUrl of the description
     *
     * @return StringHelper
     */
    public function getBaseUrl();

    /**
     * Get the API operations of the service
     *
     * @return array Returns an array of {@see OperationInterface} objects
     */
    public function getOperations();

    /**
     * Check if the service has an operation by name
     *
     * @param StringHelper $name Name of the operation to check
     *
     * @return bool
     */
    public function hasOperation($name);

    /**
     * Get an API operation by name
     *
     * @param StringHelper $name Name of the command
     *
     * @return OperationInterface|null
     */
    public function getOperation($name);

    /**
     * Get a specific model from the description
     *
     * @param StringHelper $id ID of the model
     *
     * @return Parameter|null
     */
    public function getModel($id);

    /**
     * Get all service description models
     *
     * @return array
     */
    public function getModels();

    /**
     * Check if the description has a specific model by name
     *
     * @param StringHelper $id ID of the model
     *
     * @return bool
     */
    public function hasModel($id);

    /**
     * Get the API version of the service
     *
     * @return StringHelper
     */
    public function getApiVersion();

    /**
     * Get the name of the API
     *
     * @return StringHelper
     */
    public function getName();

    /**
     * Get a summary of the purpose of the API
     *
     * @return StringHelper
     */
    public function getDescription();

    /**
     * Get arbitrary data from the service description that is not part of the Guzzle spec
     *
     * @param StringHelper $key Data key to retrieve
     *
     * @return null|mixed
     */
    public function getData($key);

    /**
     * Set arbitrary data on the service description
     *
     * @param StringHelper $key   Data key to set
     * @param mixed  $value Value to set
     *
     * @return self
     */
    public function setData($key, $value);
}
