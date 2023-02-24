import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CARS,
  GET_PEOPLE_AND_CARS,
  REMOVE_CAR,
  REMOVE_PERSON,
} from "../../queries";

import filter from "lodash.filter";
import UpdatePerson from "../forms/UpdatePerson";
import UpdateCar from "../forms/UpdateCar";

const getStyles = () => ({
  wrapper: {
    display: "flex",
    width: "100%",
  },
  card: {
    width: "100%",
  },
  delete: {
    color: "red",
  },
});

const PersonCard = (props) => {
  const [id] = useState(props.id);
  const [firstName, setFirstName] = useState(props.firstName);
  const [cars, setCars] = useState(props.cars);
  const [lastName, setLastName] = useState(props.lastName);
  const [editMode, setEditMode] = useState(false);
  const [carInEditMode, setInCarEditMode] = useState(-1);

  const { loading, error, data } = useQuery(GET_CARS);
  const [removePerson] = useMutation(REMOVE_PERSON);
  const [removeCar] = useMutation(REMOVE_CAR);

  const styles = getStyles();

  useEffect(() => {
    setCars(data?.cars?.filter((p) => p.personId === id));
  }, [data?.cars, id]);

  const handleDeletePerson = (personId) => {
    removePerson({
      variables: {
        id: personId,
      },
      update: (cache, { data: { removePerson } }) => {
        const data = cache.readQuery({ query: GET_PEOPLE_AND_CARS });

        cache.writeQuery({
          query: GET_PEOPLE_AND_CARS,
          data: {
            ...data,
            people: filter(data.people, (p) => {
              return p.id !== personId;
            }),
          },
        });
      },
    });
  };

  const handleDeleteCar = (carId) => {
    removeCar({
      variables: {
        id: carId,
      },
      update: (cache, { data: { removeCar } }) => {
        const data = cache.readQuery({ query: GET_CARS });

        cache.writeQuery({
          query: GET_CARS,
          data: {
            ...data,
            cars: filter(data.cars, (c) => c.id !== carId),
          },
        });
      },
    });
  };

  const handleButtonClick = () => {
    setEditMode(!editMode);
  };

  const updateStateVariable = (variable, value) => {
    switch (variable) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      default:
        break;
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div style={styles.wrapper}>
      {editMode ? (
        <UpdatePerson
          id={props.id}
          firstName={props.firstName}
          lastName={props.lastName}
          onButtonClick={handleButtonClick}
          updateStateVariable={updateStateVariable}
        />
      ) : (
        <Card
          title={`${firstName} ${lastName}`}
          style={styles.card}
          actions={[
            <EditOutlined key="edit" onClick={() => setEditMode(true)} />,
            <DeleteOutlined
              key="ellipsis"
              style={styles.delete}
              onClick={() => handleDeletePerson(id)}
            />,
          ]}
        >
          {cars?.map((car, i) => (
            <div key={i}>
              {carInEditMode === i ? (
                <UpdateCar
                  key={i}
                  id={car.id}
                  year={car.year}
                  make={car.make}
                  model={car.model}
                  price={car.price}
                  personId={car.personId}
                  onButtonClick={() => setInCarEditMode(-1)}
                  updateStateVariable={updateStateVariable}
                />
              ) : (
                <Card
                  key={i}
                  type="inner"
                  title={`${car.year} ${car.make} ${car.model} -> $ ${car.price}`}
                  style={{ marginBottom: 6 }}
                  actions={[
                    <EditOutlined key="edit" onClick={() => setInCarEditMode(i)}/>,
                    <DeleteOutlined
                      key="ellipsis"
                      style={styles.delete}
                      onClick={() => handleDeleteCar(car.id)}
                    />,
                  ]}
                ></Card>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default PersonCard;
