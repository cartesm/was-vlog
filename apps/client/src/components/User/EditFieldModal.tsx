import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface IFieldData {
  field: string;
}

function EditFieldModal({
  isOpen,
  changeOpen,
  field,
  fieldData,
}: {
  isOpen: boolean;
  changeOpen: () => void;
  field: string;
  fieldData?: string;
}) {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<IFieldData>({
    ...(fieldData && { defaultValues: { field: fieldData } }),
  });

  const onSubmit = async (data: IFieldData) => {
    console.log(data);
    console.log(field);
  };

  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between gap-3">
              <Input {...register("field", { required: true, minLength: 4 })} />
              <Button>Actualizar</Button>
            </div>
            <div>
              {errors.field?.type == "required" && (
                <span className="error-message">
                  No se puede dejar en blanco
                </span>
              )}
              {errors.field?.type == "minLength" && (
                <span className="error-message">El largo minimo es de 4</span>
              )}
            </div>
          </form>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}

export default EditFieldModal;
