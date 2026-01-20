import { Button, Typography } from '@mui/material';

export function Hero() {
  return (
    <section className="hero-section d-flex flex-column justify-content-center align-items-start">
      <div className="container-fluid px-3 px-md-5">
        <div className="hero-kicker text-uppercase">Scroll-driven experience</div>
        <Typography
          variant="h1"
          className="hero-title display-1 fw-bold"
        >
          BRAHMAN
        </Typography>
        <Typography
          variant="subtitle1"
          className="hero-subtitle mt-3 text-muted"
        >
          A scroll into the voices that sit behind thought, wrapped in pixels and light.
        </Typography>
        <div className="mt-4 d-flex gap-3 hero-actions">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="hero-button-primary"
            href="#gods"
          >
            Begin descent
          </Button>
          <Button
            variant="text"
            color="inherit"
            size="large"
            className="hero-button-secondary"
          >
            What is this?
          </Button>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <div className="hero-scroll-line" />
          <div className="hero-scroll-text">scroll</div>
        </div>
      </div>
    </section>
  );
}

