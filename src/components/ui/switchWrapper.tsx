import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "./switch";

const SwitchToolTipWrapper = ({
  checked,
  setChecked,
  switchClassName,
  specialKey,
  userHasOrganization,
}: {
  checked: boolean;
  setChecked: () => void;
  switchClassName?: string;
  specialKey: string;
  userHasOrganization: boolean;
}) => {
  return (
    <>
      {!userHasOrganization ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  checked={checked}
                  setChecked={setChecked}
                  className={switchClassName}
                  specialKey={specialKey}
                  userHasOrganization={userHasOrganization}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              <p>Create an organization to unlock this view.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Switch
          checked={checked}
          setChecked={setChecked}
          className={switchClassName}
          specialKey={specialKey}
          userHasOrganization={userHasOrganization}
        />
      )}
    </>
  );
};

export default SwitchToolTipWrapper;
