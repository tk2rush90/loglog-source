import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Component({
  selector: 'app-toast-outlet',
  templateUrl: './toast-outlet.component.html',
  styleUrls: ['./toast-outlet.component.scss']
})
export class ToastOutletComponent implements OnInit, OnDestroy {
  /**
   * view container reference to create inner contents dynamically
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef | undefined;

  /**
   * generate random key for outlet
   */
  id = RandomUtil.key();

  constructor(
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this._registerOutlet();
  }

  ngOnDestroy(): void {
    this._unregisterOutlet();
  }

  /**
   * register current outlet
   */
  private _registerOutlet(): void {
    this.toastService.registerOutlet(this);
  }

  /**
   * Unregister the outlet from the service.
   */
  private _unregisterOutlet(): void {
    this.toastService.unregisterOutlet(this);
  }
}
