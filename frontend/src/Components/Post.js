import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  var subTitle = props.property.message.slice(0,350);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 800 }}   style = {{marginTop: 50}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            SM
          </Avatar>
        }

        title="Sultanov M - [userId]"
        subheader="September 20, 2022"
      />
      <CardMedia
        component="img"
        height="500"
        image= {props.property.img}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary" style={{color: 'black', fontSize: 24}}>
          {props.property.title}
        </Typography>
        <Typography paragraph>
          {subTitle + " ..."}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{marginLeft: 20}}>
        <ThumbUpOutlinedIcon style = {{color: '#0077b6'}}/>
        <Typography style= {{padding: 10, fontSize: 14}}>
          {props.property.like}
        </Typography>
        <ThumbDownOutlinedIcon style = {{color: '#ee6c4d'}}/>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {props.property.message}
          </Typography>
        </CardContent>
        ----Comment Component
      </Collapse>
    </Card>
  );
}