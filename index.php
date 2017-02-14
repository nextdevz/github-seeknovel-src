<?php
  use Silex\Application;
  use Silex\Provider\TwigServiceProvider;
  use Symfony\Component\HttpFoundation\Request;

  // create the Silex application
  $app = new Application();
  $app->register(new TwigServiceProvider());
?>
