import type { Accessor, Component, Setter } from 'solid-js';
import { createSignal } from "solid-js";

import useTheme from "@suid/material/styles/useTheme";
import ArrowBackIcon from "@suid/icons-material/ArrowBack";
import { Alert, AppBar, Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@suid/material";

import allEvents from '../events.json'

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
          <Button color="inherit" onClick={() => setOpenPlane(true)}>Estands</Button>
        </Toolbar>
      </AppBar> : <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="back" sx={{ mr: 2 }} onClick={() => {
            setOpenPlane(false);
            setSelectedEventId(-1);
          }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Plano {selectedEventId() > -1 ? '| ' + allEvents.find(x => x.id === selectedEventId())?.title : '| Estands'}
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
    <Alert severity="info">Puedes presionar los eventos para abrirlos en un plano.</Alert>
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
  return (<>
    <Alert severity="info">WIP</Alert>
  </>);
}

export default App;
