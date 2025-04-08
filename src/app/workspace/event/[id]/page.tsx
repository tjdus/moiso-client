"use client"

import { getEventDetail } from "@/lib/api/getApi";
import { useEffect, useState, use } from "react";
import { EventDTO } from "@/lib/api/interface/fetchDTOs";

interface Props {
    params: Promise<{ id: string }>;
};

const EventDetailPage = ({ params }: Props) => {
    const [event, setEvent] = useState<EventDTO | null>(null);
    const { id } = use(params);

    useEffect(() => {
        const getEvent = async () => {
            const response = await getEventDetail(id);
            setEvent(response.data);
        };

        getEvent();
    }, [id]);

    return (
        <></>
    );
};

export default EventDetailPage;
