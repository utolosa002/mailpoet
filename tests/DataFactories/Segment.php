<?php

namespace MailPoet\Test\DataFactories;

use Carbon\Carbon;

class Segment {

  private $data;

  public function __construct() {
    $this->data = [
      'name' => 'List ' . uniqid(),
    ];
  }

  /**
   * @param string $name
   * @return $this
   */
  public function withName($name) {
    $this->data['name'] = $name;
    return $this;
  }

  /**
   * @param string $description
   * @return $this
   */
  public function withDescription($description) {
    $this->data['description'] = $description;
    return $this;
  }

  /**
   * @return $this
   */
  public function withDeleted() {
    $this->data['deleted_at'] = Carbon::now();
    return $this;
  }

  /** @return \MailPoet\Models\Segment */
  public function create() {
    return \MailPoet\Models\Segment::createOrUpdate($this->data);
  }

}