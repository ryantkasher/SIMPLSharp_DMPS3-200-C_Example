using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using Crestron.SimplSharp;                          	// For Basic SIMPL# Classes
using Crestron.SimplSharp.CrestronSockets;
using Crestron.SimplSharpPro;                       	// For Basic SIMPL#Pro classes
using Crestron.SimplSharpPro.CrestronThread;        	// For Threading
using Crestron.SimplSharpPro.Diagnostics;		    	// For System Monitor Access
using Crestron.SimplSharpPro.DeviceSupport;         	// For Generic Device Support
using Crestron.SimplSharpPro.DM;                        // For DM Device Support
using Crestron.SimplSharpPro.DM.Cards;
using Crestron.SimplSharpPro.DM.Endpoints.Receivers;
using Crestron.SimplSharpPro.UI;

namespace DMPS3200C_Example
{
    public class ControlSystem : CrestronControlSystem
    {
        private DmRmc4k100C myDmRmc4k100C;
        public Tsw760 myTSW760;
        

        /// <summary>
        /// ControlSystem Constructor. Starting point for the SIMPL#Pro program.
        /// Use the constructor to:
        /// * Initialize the maximum number of threads (max = 400)
        /// * Register devices
        /// * Register event handlers
        /// * Add Console Commands
        /// 
        /// Please be aware that the constructor needs to exit quickly; if it doesn't
        /// exit in time, the SIMPL#Pro program will exit.
        /// 
        /// You cannot send / receive data in the constructor
        /// </summary>
        public ControlSystem()
            : base()
        {
            try
            {
                Thread.MaxNumberOfUserThreads = 20;

                //Subscribe to the controller events (System, Program, and Ethernet)
                CrestronEnvironment.SystemEventHandler +=
                    new SystemEventHandler(ControlSystem_ControllerSystemEventHandler);
                CrestronEnvironment.ProgramStatusEventHandler +=
                    new ProgramStatusEventHandler(ControlSystem_ControllerProgramEventHandler);
                CrestronEnvironment.EthernetEventHandler +=
                    new EthernetEventHandler(ControlSystem_ControllerEthernetEventHandler);

                CrestronConsole.PrintLine(String.Format("Info: {0}", SwitcherOutputs[Convert.ToUInt16(eDmps34K250COutputs.Dm1)].CardInputOutputType));
                if (SwitcherOutputs[Convert.ToUInt16(eDmps34K250COutputs.Dm1)].CardInputOutputType == eCardInputOutputType.Dmps3DmOutputBackend)
                {
                    myDmRmc4k100C = new DmRmc4k100C(0x03, (Card.Dmps3DmOutputBackend)SwitcherOutputs[Convert.ToUInt16(eDmps34K250COutputs.Dm1)]);
                }
                
                myTSW760 = new Tsw760(0x04, this);
                myTSW760.ExtenderSystemReservedSigs.Use();
            }
            catch (Exception e)
            {
                ErrorLog.Error("Error in the constructor: {0}\n", e.Message);
            }
        }

        /* Example if not including manual console route commands and instead using joins only...
         * 
           public void VideoRoute(uint src, uint dest)
           {
                try
                {
                    ((DMOutput)SwitcherOutputs[dest]).VideoOut = (DMInput)SwitcherInputs[src];
                    CrestronConsole.PrintLine("{0} routed to {1}\n", ((DMInput)SwitcherInputs[src]),
                    ((DMOutput)SwitcherOutputs[dest]));
                }
                catch (Exception e)
                {
                    CrestronConsole.PrintLine("Error processing cmd: {0}\n", e.Message);                        
                }
           }
         * 
         */

        public void VideoRoute(string args)
        {
            string[] myargs = args.Split(' ');
            if (args != "")
            {
                uint src;
                uint dest;
                if (myargs[0] != "0" && myargs[1] != "0")
                {
                    try
                    {
                        src = UInt32.Parse(myargs[0]);
                        dest = UInt32.Parse(myargs[1]);
                        ((DMOutput)SwitcherOutputs[dest]).VideoOut = (DMInput)SwitcherInputs[src];
                        CrestronConsole.PrintLine("CMD:VideoRoute >>> {0} routed to {1}\n", ((DMInput)SwitcherInputs[src]),
                            ((DMOutput)SwitcherOutputs[dest]));
                    }
                    catch (Exception e)
                    {
                        CrestronConsole.PrintLine("ERROR PROCESSING CMD:VideoRoute >>> {0}\n", e.Message);                        
                    }
                }
                else if (myargs[0] == "0" && myargs[1] != "0")
                {
                    dest = UInt32.Parse(myargs[1]);
                    ((DMOutput) SwitcherOutputs[dest]).VideoOut = null;
                    CrestronConsole.PrintLine("CMD:VideoRoute >>> Unrouted {1}\n", ((DMOutput)SwitcherOutputs[dest]));
                }
                else if (myargs[0] == "0" && myargs[1] == "0")
                {
                    ((DMOutput) SwitcherOutputs[1]).VideoOut = null;
                    ((DMOutput) SwitcherOutputs[2]).VideoOut = null;
                    CrestronConsole.PrintLine("CMD:VideoRoute >>> Unrouted All\n");
                }
                else
                {
                    CrestronConsole.PrintLine("ERROR PROCESSING CMD:VideoRoute >>> Missing or Invalid Parameters!\n");
                }
            }
            Thread.Sleep(1000);
        }

        public void AudioRoute(string args)
        {
            string[] myargs = args.Split(' ');
            if (args != "")
            {
                uint src;
                uint dest;
                if (myargs[0] != "0" && myargs[1] != "0")
                {
                    try
                    {
                        src = UInt32.Parse(myargs[0]);
                        dest = UInt32.Parse(myargs[1]);
                        ((DMOutput)SwitcherOutputs[dest]).AudioOut = (DMInput)SwitcherInputs[src];
                        CrestronConsole.PrintLine("CMD:Audio Route >>> {0} routed to {1}\n", ((DMInput)SwitcherInputs[src]),
                            ((DMOutput)SwitcherOutputs[dest]));
                    }
                    catch (Exception e)
                    {
                        CrestronConsole.PrintLine("ERROR PROCESSING CMD:AudioRoute >>> {0}\n", e.Message);
                    }
                }
                else if (myargs[0] == "0" && myargs[1] != "0")
                {
                    dest = UInt32.Parse(myargs[1]);
                    ((DMOutput)SwitcherOutputs[dest]).AudioOut = null;
                    CrestronConsole.PrintLine("CMD:AudioRoute >>> Unrouted {1}\n",((DMOutput)SwitcherOutputs[dest]));
                }
                else if (myargs[0] == "0" && myargs[1] == "0")
                {
                    for (uint i = 1; i < 8; i++)
                    {
                    ((DMOutput)SwitcherOutputs[i]).AudioOut = null;
                    CrestronConsole.PrintLine("CMD:AudioRoute >>> Unrouted All\n");
                    break;
                    }
                }
                else
                {
                    CrestronConsole.PrintLine("ERROR PROCESSING CMD:AudioRoute >>> Missing or Invalid Parameters!\n");
                }
            }
            Thread.Sleep(1000);
        }

        public void MasterVolume(string masterVol)
        {
            var volume = this.SwitcherOutputs[(uint)eDmps3200cOutputs.Program] as Card.Dmps3OutputBase;
            if (masterVol != "")
            {
                short masterLvl = Int16.Parse(masterVol);
                if(masterLvl >= -800 && masterLvl <= 100)
                {
                    volume.MasterVolume.ShortValue = masterLvl;
                    CrestronConsole.PrintLine("CMD:MasterVolume >>> Level set to {0}\n", volume.MasterVolumeFeedBack.ShortValue.ToString());
                }
                else
                {
                    CrestronConsole.PrintLine("ERROR PROCESSING CMD:MasterVolume >>> Unable to set Level!\n");
                }
            }
            else if(masterVol == "")
            {
                CrestronConsole.PrintLine("CMD:MasterVolume >>> Current Level is {0}\n", volume.MasterVolumeFeedBack.ShortValue.ToString());
            }
            Thread.Sleep(1000);
        }

        public void MasterVolumeMute(string masterMute)
        {
            var volumeMute = this.SwitcherOutputs[(uint)eDmps3200cOutputs.Program] as Card.Dmps3OutputBase;
            if (volumeMute != null)
            {
                switch (masterMute.ToUpper())
                {
                    case ("ON"):
                        volumeMute.MasterMuteOn();
                        CrestronConsole.PrintLine("CMD:MasterVolumeMute >>> Muting...\n");
                        break;

                    case ("OFF"):
                        volumeMute.MasterMuteOff();
                        CrestronConsole.PrintLine("CMD:MasterVolumeMute >>> Un-Muting...\n");
                        break;

                    case (""):
                        if (volumeMute.MasterMuteOffFeedBack.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:MasterVolumeMute >>> Mute is ON\n");
                        }
                        else if (volumeMute.MasterMuteOnFeedBack.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:MasterVolumeMute >>> Mute is OFF\n");
                        }
                        break;
                }
            }
            Thread.Sleep(1000);
        }

        public void SystemPower(string sysPwr)
        {
            var dmps = this.SystemControl as Dmps3SystemControl;
            if (dmps != null)
            {
                switch (sysPwr.ToUpper())
                {
                    case("ON"):
                        dmps.SystemPowerOn();
                        CrestronConsole.PrintLine("CMD:SystemPower >>> System is powering ON...\n");
                        break;

                    case("OFF"):
                        dmps.SystemPowerOff();
                        CrestronConsole.PrintLine("CMD:SystemPower >>> System is powering OFF...\n");
                        break;

                    case(""):
                        if (dmps.SystemPowerOffFeedBack.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:SystemPower >>> System Power is ON\n");
                        }
                        else if (dmps.SystemPowerOnFeedBack.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:SystemPower >>> System Power is OFF\n");
                        }
                        else
                        {
                            CrestronConsole.PrintLine("ERROR PROCESSING CMD:System Power >>> Unable to set System Power state!\n");
                        }
                        break;
                }
            }
            Thread.Sleep(1000);
        }

        public void AmpPower(string ampPwr)
        {
            var power = this.SwitcherOutputs[(uint)eDmps3200cOutputs.Program] as Card.Dmps3ProgramOutput;
            if(power != null)
            {
                switch (ampPwr.ToUpper())
                {
                    case("ON"):
                        power.AmpPowerOn();
                        CrestronConsole.PrintLine("CMD:AmpPower >>> Amp is powering ON...\n");
                        break;

                    case("OFF"):
                        power.AmpPowerOff();
                        CrestronConsole.PrintLine("CMD:AmpPower >>> Amp is powering OFF...\n");
                        break;

                    case(""):
                        if (power.AmpPowerOffFeedback.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:AmpPower >>> Amp Power is ON\n");
                        }
                        else if (power.AmpPowerOnFeedback.BoolValue != true)
                        {
                            CrestronConsole.PrintLine("CMD:AmpPower >>> Amp Power is OFF\n");
                        }
                        else
                        {
                            CrestronConsole.PrintLine("ERROR PROCESSING CMD:AmpPower >>> Unable to set Amp Power state!\n");                            
                        }
                        break;
                }
            }
            Thread.Sleep(1000);
        }

        public void PanelBrightness(string args)
        {
            try
            {
                args = args.Replace(" ", String.Empty);

                if (String.IsNullOrEmpty(args))
                {
                    float curValue = (float)Convert.ToDouble(myTSW760.ExtenderSystemReservedSigs.LcdBrightness.StringValue);
                    float curPercent = curValue * (float)100;
                    curPercent = curPercent / (float)65535;
                    
                    CrestronConsole.PrintLine(String.Format("Brightness level is: {0}.", Math.Round(curPercent)));
                }
                else
                {

                    if (Convert.ToUInt16(args) >= 0 && Convert.ToUInt16(args) <= 100)
                    {
                        float newLevel = (float)Convert.ToUInt16(args) / (float)100;
                        newLevel = newLevel * (float)65535;
                        myTSW760.ExtenderSystemReservedSigs.LcdBrightness.UShortValue = (ushort)newLevel;
                    }
                    else
                    {
                        CrestronConsole.PrintLine("The value provided is out of range.");
                    }
                }
                
            }
            catch (Exception e)
            {
                CrestronConsole.PrintLine(String.Format("Exception occurred in PanelBrightness: {0}", e.Message));
            }
        }

        /// <summary>
        /// InitializeSystem - this method gets called after the constructor 
        /// has finished. 
        /// 
        /// Use InitializeSystem to:
        /// * Start threads
        /// * Configure ports, such as serial and verisports
        /// * Start and initialize socket connections
        /// Send initial device configurations
        /// 
        /// Please be aware that InitializeSystem needs to exit quickly also; 
        /// if it doesn't exit in time, the SIMPL#Pro program will exit.
        /// </summary>
        public override void InitializeSystem()
        {
            try
            {
                if (myTSW760.Register() == eDeviceRegistrationUnRegistrationResponse.Success)
                {
                    CrestronConsole.PrintLine("The panel is registered.\r");

                    CrestronConsole.AddNewConsoleCommand(PanelBrightness, "PanelBrightness",
                    "Set the brightness level of the touch panel.  SetPanelBrightness {0-100}.",
                    ConsoleAccessLevelEnum.AccessOperator);

                    PanelBrightness("50");
                }

                if (myDmRmc4k100C.Register() == eDeviceRegistrationUnRegistrationResponse.Success)
                {
                    CrestronConsole.PrintLine("The roombox is registered.\r");

                    CrestronConsole.AddNewConsoleCommand(VideoRoute, "VideoRoute",
                        "Route video. 0 Unroutes. VideoRoute {input #} {output #}",
                        ConsoleAccessLevelEnum.AccessOperator);
                    CrestronConsole.AddNewConsoleCommand(AudioRoute, "AudioRoute",
                        "Route audio. 0 Unroutes. AudioRoute {input #} {output #}",
                        ConsoleAccessLevelEnum.AccessOperator);
                    CrestronConsole.AddNewConsoleCommand(MasterVolume, "MasterVolume",
                        "Set Master Volume level. blank args to show current. MasterVolume {-800 to 100}",
                        ConsoleAccessLevelEnum.AccessOperator);
                    CrestronConsole.AddNewConsoleCommand(MasterVolumeMute, "MasterVolumeMute",
                        "Mute Master Volume level. blank args to show current. MasterVolumeMute {ON/OFF}",
                        ConsoleAccessLevelEnum.AccessOperator);
                    CrestronConsole.AddNewConsoleCommand(SystemPower, "SystemPower",
                        "Power ON/OFF the system. blank args to show current. SystemPower {ON/OFF}",
                        ConsoleAccessLevelEnum.AccessOperator);
                    CrestronConsole.AddNewConsoleCommand(AmpPower, "AmpPower",
                        "Power ON/OFF the Amp. blank args to show current. AmpPower {ON/OFF}",
                        ConsoleAccessLevelEnum.AccessOperator);
                }
            }
            catch (Exception e)
            {
                ErrorLog.Error("Error in InitializeSystem: {0}", e.Message);
            }
        }

        /// <summary>
        /// Event Handler for Ethernet events: Link Up and Link Down. 
        /// Use these events to close / re-open sockets, etc. 
        /// </summary>
        /// <param name="ethernetEventArgs">This parameter holds the values 
        /// such as whether it's a Link Up or Link Down event. It will also indicate 
        /// wich Ethernet adapter this event belongs to.
        /// </param>
        void ControlSystem_ControllerEthernetEventHandler(EthernetEventArgs ethernetEventArgs)
        {
            switch (ethernetEventArgs.EthernetEventType)
            {//Determine the event type Link Up or Link Down
                case (eEthernetEventType.LinkDown):
                    //Next need to determine which adapter the event is for. 
                    //LAN is the adapter is the port connected to external networks.
                    if (ethernetEventArgs.EthernetAdapter == EthernetAdapterType.EthernetLANAdapter)
                    {
                        //
                    }
                    break;
                case (eEthernetEventType.LinkUp):
                    if (ethernetEventArgs.EthernetAdapter == EthernetAdapterType.EthernetLANAdapter)
                    {

                    }
                    break;
            }
        }

        /// <summary>
        /// Event Handler for Programmatic events: Stop, Pause, Resume.
        /// Use this event to clean up when a program is stopping, pausing, and resuming.
        /// This event only applies to this SIMPL#Pro program, it doesn't receive events
        /// for other programs stopping
        /// </summary>
        /// <param name="programStatusEventType"></param>
        void ControlSystem_ControllerProgramEventHandler(eProgramStatusEventType programStatusEventType)
        {
            switch (programStatusEventType)
            {
                case (eProgramStatusEventType.Paused):
                    //The program has been paused.  Pause all user threads/timers as needed.
                    break;
                case (eProgramStatusEventType.Resumed):
                    //The program has been resumed. Resume all the user threads/timers as needed.
                    break;
                case (eProgramStatusEventType.Stopping):
                    //The program has been stopped.
                    //Close all threads. 
                    //Shutdown all Client/Servers in the system.
                    //General cleanup.
                    //Unsubscribe to all System Monitor events
                    break;
            }

        }

        /// <summary>
        /// Event Handler for system events, Disk Inserted/Ejected, and Reboot
        /// Use this event to clean up when someone types in reboot, or when your SD /USB
        /// removable media is ejected / re-inserted.
        /// </summary>
        /// <param name="systemEventType"></param>
        void ControlSystem_ControllerSystemEventHandler(eSystemEventType systemEventType)
        {
            switch (systemEventType)
            {
                case (eSystemEventType.DiskInserted):
                    //Removable media was detected on the system
                    break;
                case (eSystemEventType.DiskRemoved):
                    //Removable media was detached from the system
                    break;
                case (eSystemEventType.Rebooting):
                    //The system is rebooting. 
                    //Very limited time to preform clean up and save any settings to disk.
                    break;
            }

        }
    }
}