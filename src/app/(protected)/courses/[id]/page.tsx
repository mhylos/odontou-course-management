import ItemInput from "@/components/courses/[id]/ItemInput";
import Section from "@/components/courses/[id]/Section";
import SectionItem from "@/components/courses/[id]/SectionItem";
import { convertToMoney } from "@/lib/utils";

const courseInfo = {
  responsables: {
    departamentoEjecutor: "Dpto Patología y Medicina Oral",
    directorDepartamento: "Iris Espinoza",
    directorPrograma: "Sylvia Osorio",
    coordinadorPrograma: "Andres Rosa",
  },
  totalHoras: {
    directas: 16.6,
    presenciales: 4,
    noPresenciales: 16.6,
    indirectas: 16.6,
  },
  datosGenerales: {
    nombrePrograma:
      "Curso Ultrasonografía Maxilofacial: Fundamentos Imagenológicos y Anatómicos",
    objetivoPrograma:
      "Entregar las bases teóricas de la física de la ultrasonografía y de la anatomía seccional y topográfica del territorio maxilofacial.",
    comentariosRelevantes: "-",
    tipoPrograma: "E-Learning",
    inicio: "2021-08-22",
    termino: "2021-08-22",
    valorArancel: 1045000,
  },
};

export default function CourseInfo() {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-2 h-full">
      <div className="flex flex-col gap-10 justify-between">
        <Section title={"Responsables"} className="flex flex-col gap-2">
          <SectionItem title={"Departamento Ejecutor"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.responsables.departamentoEjecutor}
            />
          </SectionItem>
          <SectionItem title={"Nombre del Director del Departamento"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.responsables.directorDepartamento}
            />
          </SectionItem>
          <SectionItem title={"Nombre del Director del Programa"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.responsables.directorPrograma}
            />
          </SectionItem>
          <SectionItem title={"Nombre del Coordinador del Programa"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.responsables.coordinadorPrograma}
            />
          </SectionItem>
        </Section>
        <Section
          title={"Total de Horas"}
          className="grid grid-rows-3 grid-cols-2 gap-2"
        >
          <SectionItem title={"Directas"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.totalHoras.directas.toString()}
            />
          </SectionItem>
          <SectionItem title={"Presenciales"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.totalHoras.presenciales.toString()}
            />
          </SectionItem>
          <SectionItem title={"No Presenciales"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.totalHoras.noPresenciales.toString()}
            />
          </SectionItem>
          <SectionItem title={"Indirectas"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.totalHoras.indirectas.toString()}
            />
          </SectionItem>
          <div className="col-span-2 text-right text-xl font-light">
            <span className="block">Total</span>
            <span className="text-2xl border-b-2 border-secondary">
              {(
                courseInfo.totalHoras.directas +
                courseInfo.totalHoras.presenciales +
                courseInfo.totalHoras.noPresenciales +
                courseInfo.totalHoras.indirectas
              ).toFixed(1)}
            </span>
          </div>
        </Section>
      </div>

      <Section
        title={"Datos generales"}
        className="row-span-2 flex flex-col gap-2"
      >
        <SectionItem title={"Nombre del programa"}>
          <ItemInput
            isEditing={false}
            value={courseInfo.datosGenerales.nombrePrograma}
          />
        </SectionItem>
        <SectionItem title={"Objetivo del programa"}>
          <ItemInput
            isEditing={false}
            value={courseInfo.datosGenerales.objetivoPrograma}
          />
        </SectionItem>
        <SectionItem title={"Comentarios Relevantes"}>
          <ItemInput
            isEditing={false}
            value={courseInfo.datosGenerales.comentariosRelevantes}
            className=""
          />
        </SectionItem>
        <SectionItem title={"Tipo de Programa"}>
          <ItemInput
            isEditing={false}
            value={courseInfo.datosGenerales.tipoPrograma}
          />
        </SectionItem>

        <div className="flex">
          <SectionItem title={"Inicio"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.datosGenerales.inicio}
            />
          </SectionItem>
          <SectionItem title={"Termino"}>
            <ItemInput
              isEditing={false}
              value={courseInfo.datosGenerales.termino}
            />
          </SectionItem>
        </div>

        <SectionItem title={"Valor del arancel"}>
          <ItemInput
            isEditing={false}
            value={convertToMoney(courseInfo.datosGenerales.valorArancel)}
          />
        </SectionItem>
      </Section>
    </div>
  );
}
