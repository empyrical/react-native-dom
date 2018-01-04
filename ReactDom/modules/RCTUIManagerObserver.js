/**
 * @providesModule RCTUIManagerObserverCoordinator
 * @flow
 */

import { getPropertyNames } from "RCTBridge";
import memoize from "fast-memoize";
import RCTViewManager from "RCTViewManager";

import typeof _RCTUIManager from "RCTUIManager";
type RCTUIManager = ExtractPromise<_RCTUIManager>;

export interface RCTUIManagerObserver {
  /**
   * Called just before the UIManager layout views.
   * It allows performing some operation for components which contain custom
   * layout logic right before regular Yoga based layout. So, for instance,
   * some components which have own React-independent state can compute and cache
   * own intrinsic content size (which will be used by Yoga) at this point.
   */
  uiManagerWillPerformLayout?: (manager: RCTUIManager) => void;

  /**
   * Called just after the UIManager layout views.
   * It allows performing custom layout logic right after regular Yoga based layout.
   * So, for instance, this can be used for computing final layout for a component,
   * since it has its final frame set by Yoga at this point.
   */
  uiManagerDidPerformLayout?: (manager: RCTUIManager) => void;

  /**
   * Called before flushing UI blocks at the end of a batch.
   */
  uiManagerWillFlushBlocks?: (manager: RCTUIManager) => void;
}

class RCTUIManagerObserverCoordinator implements RCTUIManagerObserver {
  observers: Set<RCTUIManagerObserver>;

  constructor() {
    this.observers = new Set();
  }

  /**
   * Add a UIManagerObserver. See the `RCTUIManagerObserver` iterface for more info.
   */
  addObserver(observer: RCTUIManagerObserver) {
    this.observers.add(observer);
  }

  /**
   * Remove a `UIManagerObserver`.
   */
  removeObserver(observer: RCTUIManagerObserver) {
    this.observers.delete(observer);
  }

  uiManagerWillPerformLayout = (manager: RCTUIManager) => {
    for (let observer of this.observers) {
      if (typeof observer.uiManagerWillPerformLayout === "function") {
        observer.uiManagerDidPerformLayout(manager);
      }
    }
  };

  uiManagerDidPerformLayout = (manager: RCTUIManager) => {
    for (let observer of this.observers) {
      if (typeof observer.uiManagerDidPerformLayout === "function") {
        observer.uiManagerDidPerformLayout(manager);
      }
    }
  };

  uiManagerWillFlushBlocks = (manager: RCTUIManager) => {
    for (let observer of this.observers) {
      if (typeof observer.uiManagerWillFlushBlocks === "function") {
        observer.uiManagerWillFlushBlocks(manager);
      }
    }
  };
}

export default RCTUIManagerObserverCoordinator;