import type { Accessor, Component, Setter } from 'solid-js';
import { createEffect, createSignal, onMount } from 'solid-js';
import { drawFloors, locationIds } from './floors';

import useTheme from '@suid/material/styles/useTheme';
import ArrowBackIcon from '@suid/icons-material/ArrowBack';
import { Alert, AppBar, Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, Stack, Toolbar, Typography, useMediaQuery } from '@suid/material';

import allEvents from '../events.json'
import stands from '../stands.json';

interface EventsProps {
  setSelectedEventId: Setter<number>;
  setOpenPlane: Setter<boolean>;
}

interface PlaneProps {
  selectedEventId: Accessor<number>;
}

const App: Component = () => {
  const [selectedEventId, setSelectedEventId] = createSignal(-1);
  const [openPlane, setOpenPlane] = createSignal(false);

  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {!(openPlane()) ? <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Eventos
          </Typography>
          <Button color="inherit" onClick={() => setOpenPlane(true)}>Materias</Button>
        </Toolbar>
      </AppBar> : <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => {
            setOpenPlane(false);
            setSelectedEventId(-1);
          }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Plano {selectedEventId() > -1 ? '| ' + allEvents.find(x => x.id === selectedEventId())?.title : '| Materias'}
          </Typography>
        </Toolbar>
      </AppBar>}
      {!(openPlane()) ? <Events setSelectedEventId={setSelectedEventId} setOpenPlane={setOpenPlane} /> : <Plane selectedEventId={selectedEventId} />}
    </Box>
  );
};

const Events: Component<EventsProps> = (props: EventsProps) => {
  const notStartedEvents = allEvents.filter(x => Date.now() < x.time).sort((a, b) => a.time - b.time);
  const startedEvents = allEvents.filter(x => Date.now() >= x.time).sort((a, b) => b.time - a.time);

  return (<>
    <Alert severity="info">Puedes presionar los eventos para abrirlos en el plano, o seleccionar 'Materias' para ver los estands correspondientes a cada una.</Alert>
    <nav>
      <List>
        {notStartedEvents.map(event => <ListItem disablePadding>
          <ListItemButton onClick={() => {
            props.setSelectedEventId(event.id);
            props.setOpenPlane(true);
          }}>
            <ListItemText primary={event.title} secondary={`${(new Date(event.time)).getHours().toString()}:${(new Date(event.time)).getMinutes().toString().padEnd(2, '0')} hs | ${event.location}`} />
          </ListItemButton>
        </ListItem>)}
        <Divider />
        {startedEvents.map(event => <ListItem disablePadding>
          <ListItemButton onClick={() => {
            props.setSelectedEventId(event.id);
            props.setOpenPlane(true);
          }}>
            <ListItemText primary={event.title} secondary={`${(new Date(event.time)).getHours().toString()}:${(new Date(event.time)).getMinutes().toString().padEnd(2, '0')} hs | ${event.location}`} />
          </ListItemButton>
        </ListItem>)}
      </List>
    </nav>
  </>);
}

const Plane: Component<PlaneProps> = (props: PlaneProps) => {

  const [selectedFloorSign, setSelectedFloorSign] = createSignal(-1);
  const [selectedFloorStand, setSelectedFloorStand] = createSignal(-1);

  let theCanvas: HTMLCanvasElement | ((el: HTMLCanvasElement) => void) | undefined;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  onMount(() => {
    if (theCanvas instanceof HTMLCanvasElement) {
      const ctx = theCanvas.getContext('2d');
      if (ctx) {
        let selectedFloor = -1;

        if (props.selectedEventId() > -1) {
          selectedFloor = Object.values(locationIds).findIndex(x => x.includes(allEvents.find(x => x.id === props.selectedEventId())?.locationId.toString() ?? '-1')) - 1;
          selectedFloor = selectedFloor < -1 ? -1 : selectedFloor;
        }

        setSelectedFloorSign(selectedFloor);

        drawFloors(ctx, selectedFloor, allEvents.find(x => x.id === props.selectedEventId())?.locationId);
      }
    }
  });

  createEffect(() => {
    if (theCanvas instanceof HTMLCanvasElement) {
      const ctx = theCanvas.getContext('2d');
      if (ctx) {
        if (props.selectedEventId() < 0) {
          ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
          drawFloors(ctx, selectedFloorStand());
        }
      }
    }
  });

  return (<div>
    <Stack direction={!matches() ? 'column' : 'row'} divider={<Divider orientation={!matches() ? 'horizontal' : 'vertical'} flexItem />} spacing={2} sx={{ height: 'calc(100vh - 64px - 40px)', padding: '20px' }}>
      <canvas ref={theCanvas} width={450} height={600}></canvas>
      {props.selectedEventId() > -1 ? <div>
        <Typography variant="h4" gutterBottom component="div">{(selectedFloorSign() === -1) ? 'Gimnasio' : (selectedFloorSign() === 0) ? 'Planta Baja' : (selectedFloorSign() === 1) ? 'Primer Piso' : 'Desconocido'}</Typography>
        <Typography variant="subtitle1" gutterBottom component="div">El evento seleccionado tiene lugar en '<b>{allEvents.find(x => x.id === props.selectedEventId())?.location}</b>'{(allEvents.find(x => x.id === props.selectedEventId())?.locationId ?? -1) > -1 ? ', que se encuentra marcada en amarillo' : ''}.</Typography>
      </div> : <div>
        <Select value={selectedFloorStand()} onChange={event => setSelectedFloorStand(event.target.value)} sx={{ mb: 2 }}>
          <MenuItem value={-1}>Gimnasio</MenuItem>
          <MenuItem value={0}>Planta Baja</MenuItem>
          <MenuItem value={1}>Primer Piso</MenuItem>
        </Select>
        <Typography variant="body1" gutterBottom>{stands.filter(stand => Object.values(locationIds)[selectedFloorStand() + 1].includes(stand.locationId.toString())).map(stand => <p><b>{stand.locationId} ({stand.location}).</b> {stand.title}</p>)}</Typography>
      </div>}
    </Stack>
  </div>);
}

export default App;
